import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { UserRegisterReq } from "../models/Request/user_register_req";
import { RiderRegisterReq } from "../models/Request/rider_register_req";

export const router = express.Router();

// select user by uid
router.get('/customer/:uid', (req, res) => {
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
router.get('/customer/search/:phone', (req, res) => {
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
router.post('/registerUser', (req, res)=>{
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

// register for user
router.post('/registerRider', (req, res)=>{
    let riders: RiderRegisterReq = req.body;

    let sql = "INSERT INTO user (phone, name, password, picture, plate, type) VALUES (?,?,?,?,?,?)";
    sql = mysql.format(sql, [
        riders.phone,
        riders.name,
        riders.password,
        riders.picture,
        riders.plate,
        riders.type
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
router.get("/customer", (req, res) => {
    conn.query('SELECT * FROM user WHERE type = 1', (err, result, fields)=>{
      res.json(result);
    });
  });

// Get rider
router.get("/rider", (req, res) => {
    conn.query('SELECT * FROM user WHERE type != 1', (err, result, fields)=>{
      res.json(result);
    });
  });

// login user
router.post("/login", (req, res) => {
    const { phone, password } = req.body
    const query = mysql.format('SELECT * FROM user WHERE phone = ? AND password = ?', [phone, password]);
    conn.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ msg: err.message });
        }
        res.json(result[0]); 
    });
  });
