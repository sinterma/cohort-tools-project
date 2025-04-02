const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
// Schema - describes and enforces the structure of the documents

const studentSchema = new Schema({
firstName:{
    type: String,
    required: true,
  },
lastName: {
    type: String,
    required: true,
  },
email:{
    type: String,
    required: true,
    unique: true
  },
phone:{
    type: String,
    required: true,
  },
linkedinUrl:{
    type: String,
    default: "",
  },
languages:{
    type: [String],
    enum: ["English", "Spanish", "French", "German", "Portuguese", "Dutch", "Other"],
  },
program: {
    type: String,
    enum:["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
  },
background: {
    type: String,
    default: "",
  },
image:  {
    type: String,
    default: "https://i.imgur.com/r8bo8u7.png",
  },
cohort: {
  // i change this one, it works now ? let me 2 s ok monsieur it work
  // what was the problem ? we put it in an array before right ? thankss i'll comiit and push
  // [mongoose.Schema.Types.ObjectId] yes and insade the 
    type: mongoose.Schema.Types.ObjectId, 
    // type : mongoose.Schema.Types.ObjectId,
    ref: 'Cohort'
},
projects: Array,
});

// CREATE MODEL
// The model() method defines a model (Student) and creates a collection (students) in MongoDB
// The collection name will default to the lowercased, plural form of the model name:
//                          "Student" --> "students"
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;