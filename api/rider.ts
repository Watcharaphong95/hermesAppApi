import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { RiderRegisterReq } from "../models/Request/rider_register_req";

export const router = express.Router();

// register for user
router.post('/register', (req, res)=>{
    let riders: RiderRegisterReq = req.body;

    let sql = "INSERT INTO rider (phone, name, password, picture, plate) VALUES (?,?,?,?,?)";
    sql = mysql.format(sql, [
        riders.phone,
        riders.name,
        riders.password,
        riders.picture,
        riders.plate
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
    conn.query('SELECT * FROM rider', (err, result, fields)=>{
      res.json(result);
    });
  });
