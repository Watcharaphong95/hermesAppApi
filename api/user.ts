import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { UserRegisterReq } from "../models/Request/user_register_req";
import { RiderRegisterReq } from "../models/Request/rider_register_req";

export const router = express.Router();

// select user by uid
router.get('/:uid', (req, res) => {
    let uid = req.params.uid;

    let sql = 'SELECT * FROM user WHERE uid = ?'

    sql = mysql.format(sql, [
        uid
    ])

    conn.query(sql, (err, result) => {
        if(err) {
            res.status(400).json({msg: err.message});
        } else {
            res.json(result);
        }
    })
});

// select user by some phone
router.get('/search/:phone', (req, res) => {
    let phone = req.params.phone;
    let sql = 'SELECT * FROM user WHERE phone LIKE ? AND type = 1';

    sql = mysql.format(sql, [
        `${phone}%`
    ]);

    conn.query(sql, (err, result) => {
        if(err) {
            res.status(400).json({msg: err.message});
        } else {
            res.json(result);
        }
    })
});

// register for user
router.post('/register', (req, res)=>{
    let users: UserRegisterReq = req.body;

    let sql = "INSERT INTO user (phone, name, password, address, lat, lng, picture) VALUES (?,?,?,?,?,?,?)";
    sql = mysql.format(sql, [
        users.phone,
        users.name,
        users.password,
        users.address,
        users.lat,
        users.lng,
        users.picture,
    ]);
    conn.query(sql, (err, result) => {
        if(err) {
            res.status(400).json({msg: err.message});
        } else {
            res.json({affected_rows: result.affectedRows, last_idx: result.insertId});
        }
    })
});

// Get customer
router.get("/", (req, res) => {
    conn.query('SELECT * FROM user WHERE type = 1', (err, result, fields)=>{
      res.json(result);
    });
  });

// login user
router.post("/login", (req, res) => {
    const { phone, password } = req.body

    let sql = `
      SELECT uid, NULL AS rid, phone, password, type
      from user
      where phone = ?
      and password = ?

      UNION 

      SELECT NULL AS uid, rid, phone, password, type
      from rider
      where phone = ? 
      and password = ?
    `;

    sql = mysql.format(sql, [
        phone,
        password,
        phone,
        password
    ])

    conn.query(sql, (err, result) => {
        res.json(result);
    })


    // const query = mysql.format('SELECT * FROM user WHERE phone = ? AND password = ?', [phone, password]);
    // conn.query(query, (err, result) => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(400).json({ msg: err.message });
    //     }
    //     res.json(result[0]); 
    // });
  });

// delete user from uid
// router.delete("/delete", (req, res) => {
//     let sql = 'DELETE FROM user WHERE uid = 16';

//     conn.query(sql, (err, result) => {
//         if(err){
//             res.status(400).json(err.message);
//         }else{
//             res.json(result);
//         }
//     })
// });
