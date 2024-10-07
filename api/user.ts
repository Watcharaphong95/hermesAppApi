import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { UserRegisterReq } from "../models/Request/user_register_req";

export const router = express.Router();

// select all user
router.get('/', (req, res) => {
    let sql = 'SELECT * FROM user';

    conn.query(sql, (err, result) => {
        if(err) {
            res.status(400).json({msg: err.message});
        } else {
            res.status(201).json({result});
        }
    })
});

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
            res.status(201).json(result);
        }
    })
});

// select user by some phone
router.get('/search/:phone', (req, res) => {
    let phone = req.params.phone;
    let sql = 'SELECT * FROM user WHERE phone LIKE ?';

    sql = mysql.format(sql, [
        `${phone}%`
    ]);

    conn.query(sql, (err, result) => {
        if(err) {
            res.status(400).json({msg: err.message});
        } else {
            res.status(201).json(result);
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
            res.status(201).json({affected_rows: result.affectedRows, last_idx: result.insertId});
        }
    })
});
