import {cdb } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getStories = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        console.log(userId);

        const q = `SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId)
        LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId= ?) LIMIT 4`;

        db.query(q, [userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
}

export const addStory = (req, res) => {
    
}

export const deleteStory = (req, res) => {
    
}