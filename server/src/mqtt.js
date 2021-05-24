module.exports.listen = () => {
    const { Client } = require('pg');
    const db_client = new Client({
        user: 'postgres',
        host: process.env.DB_HOST? process.env.DB_HOST : 'localhost',
        database: 'webshop',
        password: 'postgres',
        port: 5432,
    });
    var mqtt = require('mqtt')
    var client = mqtt.connect('ws://broker.emqx.io:8083/mqtt')

    db_client.connect();

    client.on('connect', function () {
        client.subscribe('webshop/products', {
            qos: 0
        }, function (err) {
            if (err)
                throw err;
            client.on('message', (topic, message, packet) => {
                console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)

                var the_string = message.toString();
                var result = the_string.toLowerCase();
                var parts = result.split('-', 3);
                var the_text = parts[0];
                var the_num = parseInt(parts[1]);
                var the_amount = parseInt(parts[2]);
                var new_stock_status;

                function selectAll() {
                    const query_select = {
                        text: 'SELECT * FROM products',
                        rowMode: 'array'
                    };

                    db_client.query(query_select).then(res => {

                        const data = res.rows;

                        console.log('ALL DATA:');
                        data.forEach(row => {
                            console.log(`id: ${row[0]} stock: ${row[4]}`);
                        })
                    });
                }

                function find_stock_status(productno) {
                    if (the_text == "check") {
                        const query_select = {
                            text: `SELECT * FROM products WHERE id=${productno}`,
                            rowMode: 'array'
                        };

                        db_client.query(query_select).then(res => {

                            const data = res.rows;

                            console.log(`SPECIFIC DATA FOR PRODUCT: ${productno}`);
                            data.forEach(row => {
                                console.log(`id: ${row[0]} stock: ${row[4]}`);
                            })
                        });
                    }
                }

                function update_packages(productno, choice, callback) {
                    if (choice == "in") {
                        const query_select = {
                            text: `SELECT * FROM products WHERE id=${productno}`,
                            rowMode: 'array'
                        };

                        db_client.query(query_select).then(res => {
                            var stock_status;
                            const data = res.rows;

                            console.log(`SPECIFIC DATA FOR PRODUCT: ${productno}`);
                            data.forEach(row => {
                                stock_status = `${row[4]}`;
                                new_stock_status = parseInt(stock_status);
                                console.log(new_stock_status);
                                new_stock_status += the_amount;
                            })

                            callback();
                        });
                    }

                    if (choice == "out") {
                        const query_select = {
                            text: `SELECT * FROM products WHERE id=${productno}`,
                            rowMode: 'array'
                        };

                        db_client.query(query_select).then(res => {
                            var stock_status;
                            const data = res.rows;

                            console.log(`SPECIFIC DATA FOR PRODUCT: ${productno}`);
                            data.forEach(row => {
                                stock_status = `${row[4]}`;
                                new_stock_status = parseInt(stock_status);
                                console.log(new_stock_status);
                                new_stock_status -= the_amount;
                                if(new_stock_status < 0){
                                    new_stock_status = 0;
                                }
                            })

                            callback();
                        });
                    }
                }

                const string = message.toString();

                if (the_text == "in") {
                    update_packages(the_num, "in", () => {
                        console.log(new_stock_status);
                        const query_update = `DO
                    $do$
                    BEGIN
                       IF EXISTS (SELECT * FROM products WHERE id=${the_num}) THEN
                          UPDATE products SET stock=${new_stock_status} WHERE id=${the_num};
                       ELSE
                          INSERT INTO products(id,stock) VALUES (${the_num},1);
                       END IF;
                    END
                    $do$
                `;

                        db_client.query(query_update, (err, res) => {
                            console.log('Data update successful');
                        });
                    });
                }

                if (the_text == "out") {
                    update_packages(the_num, "out", () => {
                        console.log(new_stock_status);
                        const query_update = `DO
                    $do$
                    BEGIN
                       IF EXISTS (SELECT * FROM products WHERE id=${the_num}) THEN
                          UPDATE products SET stock=${new_stock_status} WHERE id=${the_num};
                       ELSE
                          INSERT INTO products(id,stock) VALUES (${the_num},0);
                       END IF;
                    END
                    $do$
                `;

                        db_client.query(query_update, (err, res) => {
                            console.log('Data update successful');
                        });
                    });
                }

                if (the_text == "check") {
                    find_stock_status(the_num);
                }
                selectAll();
            })
        })
    })
}
