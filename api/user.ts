import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { UserRegisterReq } from "../models/Request/user_register_req";

export const router = express.Router();

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

// Get user
router.get("/", (req, res) => {
    conn.query('SELECT * FROM user', (err, result, fields)=>{
      res.json(result);
    });
  });