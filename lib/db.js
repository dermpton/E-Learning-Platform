const express = require('express');
const app = express();
const mongoose = require('mongoose');


module.exports = mongoose.connect("mongodb://localhost:27017/e-learning-platform")
                         .then(()=>{ console.log('Connection Succeeded')})
                         .catch((err)=> console.error(`Error: ${err.message}`));


// Understanding MongoDB:

/*
Help Guide

The Hierarchy
Database - the overall container
Collection(s) - Describes a set of documents (like Tables)
Document -  A single more like a record/tuple from MySQL 
Model - the ODM (Object Data Modelling library) used to do CRUD
Schema - Describes the structure and how to store the data in a document

*/

// const LotteryTicketSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     numbers: { type: [Number], required: true },
//     drawDate:{ type: Date, required: true },
//     isWinner: { type: Boolean, default: false }
// });