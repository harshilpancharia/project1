var express=require("express");
var cloudinary=require("cloudinary").v2;
var mysql2 = require("mysql2");
var fileUploader =require("express-fileupload");
var app=express();

//Saving cloudinary information
cloudinary.config({ 
    cloud_name: 'dskm9q08s', 
    api_key: '213668766262337', 
    api_secret: 'ZoScT-y-cjyeswEovIuvAudGJKo' // Click 'View API Keys' above to copy your API secret
});


//server starts
app.listen(2005,function(){
    console.log("Server Started");
})

// Establishing Connection with Database
let dbConfig = "mysql://avnadmin:AVNS_oeO5KeE5srFIkZGbpDm@mysql-practice-fullstack-training.g.aivencloud.com:19960/NextHope";
let mysqlserver=mysql2.createConnection(dbConfig);

mysqlserver.connect(function(err){
    if(err){
        console.log(err.message);
    }
    else{
        console.log("Connection to DB Established.")
    }
})

app.use(express.urlencoded(true)); 
app.use(fileUploader());

//used to enable css and styling and creates an all time and anywhere accessable public folder
app.use(express.static("public"));

//index file's URL Handling
app.get("/",function(req,resp){
    let dirName=__dirname;
    let indexfile=dirName+"/pages/index.html";
    resp.sendFile(indexfile);
})
// Save sign up information--> requires duplicacy handling
app.get("/save-signup-information",function(req,resp){
   
    let sgnemail=req.query.sgnemail;
    let sgnpassword=req.query.sgnpassword;
    let usertype=req.query.dropdown1;

    if(!sgnemail || !sgnpassword || sgnemail=="" || sgnpassword=="" || usertype==="Select"){
        resp.send("Fill data properly")
    }
    else{
        mysqlserver.query("select email from UserSignUp where email=?",[sgnemail],function(err,ress){
        if(ress.length===0){
            mysqlserver.query("INSERT INTO UserSignUp (email, pass, usertype) VALUES (?,?,?)",[sgnemail,sgnpassword,usertype],function(err,res2){
                if(!err){
                console.log("res2"+res2)
                console.log("a user just signed up. with email: "+sgnemail);
                resp.send("Account created sucessfully! Please login now. DB")}
                else{console.log(err+" while inserting data")}
            })
        }
        else{
            resp.send("Email already exists!")
            // console.log(err)
            
        }})
    }



    
   
})

// Perform a real time validation above email box on sign up
app.get("/signup-email-check",function(req,resp){
    let sgnemail=req.query.sgnemail;
    mysqlserver.query("SELECT * from UserSignUp where email=?",[sgnemail],function(err,res){
        
        if(sgnemail==0){
            resp.send("Please enter valid email.")
        }
        else{
            if(res!=0){
                resp.send("Email already exists!")
            }
            else{
                resp.send("New User Detected!")
            }
        }
    })
})

// Login to account -> backend
app.get("/save-login-information",function(req,resp){

     let lgnemail=req.query.lgnemail; //what user inputs in the email login box
     let lgnpassword=req.query.lgnpassword; //what user inputs in the password login box
     mysqlserver.query("SELECT email from UserSignUp where email=?",[lgnemail],function(err,ress1){
        if(ress1!=0){
            mysqlserver.query("SELECT email from UserSignUp where email=?",[lgnemail],function(err,ress){
                // console.log(ress)
                // console.log(ress[0].email)
                if(ress[0].email===lgnemail){
                    mysqlserver.query("SELECT pass,usertype from UserSignUp where email=?",[lgnemail],function(err,resss){
                        console.log(resss)
                        let userpass = resss[0].pass
                        let typeofuser = resss[0].usertype
                        if(userpass===lgnpassword){
                            resp.send("You're Logged in, Welcome! "+typeofuser)
                        }
                        else{
                            resp.send("Incorrect password.")
                        }
                    })
                }
                else{
                    if(lgnemail==0){
                        resp.send("Enter a valid email address.")
                    }
                    else{
                        resp.send("User doesn't exist!")
                    }
                }
            })
        }
        else{
            resp.send("User not present in db")
        }
     })
 
    
})
// personal approach 1
    //  mysqlserver.query("SELECT * from UserSignUp where email=? AND pass=?",[lgnemail,lgnpassword],function(err,ress){
    //     console.log(ress)
        
    //     if(ress.length===0){
    //         resp.send("Enter a valid email")
    //     }
        
    //     else{
    //         let useremail = ress[0].email;
    //         let userpwd = ress[0].pass;
    //         if(useremail==lgnemail){
    //             if(userpwd==lgnpassword){
    //             resp.send("You're logged-in!")}
    //             else{
    //                 resp.send("Incorrect Password")
    //             }
    //         }
    //         else{
    //             resp.send("User doesn't exist!")
    //         }
    //     }
// personal approach 2
        //  if(ress > 0 && ress[0].email==lgnemail && ress[0].pass==lgnpassword){
        //     console.log("Data Found in DB");
        //     resp.send("Logged In")
        //  }
        //  else{
        //     resp.send("User doesn't exist.")
        //  }
         
  
 

//  app.get("/user-login-page",function(req,resp){
//     let sgnEmail1 = req.query.sgnEmail1;
//     let sgnPwd1 = req.query.sgnPwd1;

//     mysqlserver.query("SELECT * from userInfo where email=? AND pwd=?",[sgnEmail1,sgnPwd1],function(err,resultArr){
//         if (resultArr.length === 0) {
//             resp.send("Invalid Email ID");
//         } else {
//             let lgnpswd = resultArr[0].pwd;

//             if (lgnpswd === sgnPwd1) {
//                 resp.send("Login Successful");
//             } else {
//                 resp.send("Invalid Password");
//             }
//            }

        
//         
//     })
// })

// Fetch Button - fetches all information related to the email and inputs into the fields
app.post("/volkyc-fetch",function(req,resp){
    let userkycEmail = req.body.userkycEmail
    if(!userkycEmail){
        resp.send("Enter Valid Email")
    }
    else{
        mysqlserver.query("select * from volkyc where emailid=? ",[userkycEmail],function(err,res){
            // console.log(res)
            if(res.length===0){
                resp.send("KYC Pending...")
            }
            else{
                if(err){
                    resp.send("Error! while fetching your data!")
                }
                else{
                resp.send(res)}
            }
        })
    }
})
// volunteer dashboard page
app.get("/vol-dash",function(req,resp){
    let dirName = __dirname
    let fullpath = __dirname+"/pages/vol-dash.html"
    resp.sendFile(fullpath)
})
// volunteer kyc page
app.get("/vol-kyc",function(req,resp){
    let dirName = __dirname
    let fullpath = __dirname+"/pages/vol-kyc.html"
    resp.sendFile(fullpath)
})
// Registering Volunteer KYC
app.post("/volkyc-register", async function (req, resp) {
    let userkycEmail = req.body.userkycEmail;
    let userkycName = req.body.userkycName;
    let userkycContact = req.body.userkycContact;
    let userkycAddress = req.body.userkycAddress;
    let userkycCity = req.body.userkycCity;
    let userkycGender = req.body.userkycGender;
    let userkycDob = req.body.userkycDob;
    let userkycQual = req.body.userkycQual;
    let userkycOccupation = req.body.userkycOccupation;
    let userkycOinfo = req.body.userkycOinfo;
    // let userkycPpic = req.files.userkycPpic;
    // let userkycIDproof = req.files.userkycIDproof;
    // console.log(userkycPpic)
    // console.log(userkycIDproof)
    let fileNamePpic;
    let fileNameID;
    // console.log(userkycEmail)

    mysqlserver.query("select email from UserSignUp  where email=?",[userkycEmail],async function(err,resMain){
        // console.log("resultMain "+JSON.stringify(resMain))
        try{
            console.log(userkycEmail)
            if(!userkycEmail){
                resp.send("Please enter valid email.")
            }
            else{
                if(resMain[0].email==userkycEmail){
                    console.log(err+"1")
                    // resp.send("Email is verified!")
                    if (!userkycEmail || !userkycName || !userkycContact || !userkycAddress || !userkycCity || !userkycDob
                        || userkycOccupation == "Select" || userkycQual == "Select"
                        || userkycGender == "Select") {
                        resp.send("Enter valid details!")
                        console.log(err+"2")
                    }
                    else {
                        console.log(err+"3")
                        if (!req.files) {
                            fileNamePpic = "nopic.jpg";
                            fileNameID = "nopic2.jpg";
                            resp.send("files not uploaded")
                            // console.log(fileNameID + " " + fileNamePpic)
                            console.log(err+"4")
                        }
                        else {console.log(err+"5")
                            {
                                fileNamePpic = req.files.userkycPpic.name;
                                let locationToSavePpic = __dirname + "/public/uploads/" + fileNamePpic;//full ile path
                                req.files.userkycPpic.mv(locationToSavePpic);//saving file in uploads folder
                    
                                //saving ur file/pic on cloudinary server
                                await cloudinary.uploader.upload(locationToSavePpic).then(function (picUrlResultPpic) {
                                    fileNamePpic = picUrlResultPpic.url;   //will give u the url of ur pic on cloudinary server
                                    console.log(fileNamePpic);
                                });
                                fileNameID = req.files.userkycIDproof.name;
                                let locationToSaveID = __dirname + "/public/uploads/" + fileNameID;//full ile path
                                req.files.userkycIDproof.mv(locationToSaveID);//saving file in uploads folder
                                
                                // 2 second delay for the next upload
                                await new Promise(resolve => setTimeout(resolve, 2000)); 
                    
                                //saving ur file/pic on cloudinary server
                                await cloudinary.uploader.upload(locationToSaveID).then(function (picUrlResultIDproof) {
                                    fileNameID = picUrlResultIDproof.url;   //will give u the url of ur pic on cloudinary server
                                    console.log(fileNameID);
                                    console.log(err+"6")
                                });
                                mysqlserver.query("select email,emailid from UserSignUp INNER JOIN volkyc ON UserSignUp.email=volkyc.emailid where volkyc.emailid=?",
                                    [userkycEmail], function (err, res) {
                                        console.log(err+"7")
                                        console.log(res)
                                        if (res.length===0) {
                                            console.log(err+"8")
                                            mysqlserver.query("INSERT INTO volkyc(emailid, fullname, contact, address, city, gender, dob, quali, occu, info, picpath, idpath) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [
                                                userkycEmail,
                                                userkycName,
                                                userkycContact,
                                                userkycAddress,
                                                userkycCity,
                                                userkycGender,
                                                userkycDob,
                                                userkycQual,
                                                userkycOccupation,
                                                userkycOinfo,
                                                fileNamePpic,
                                                fileNameID
                                            ], function (err, res2) {
                                                if(!err){
                                                    console.log(err+"9")
                                                resp.send("KYC Completed successfully!")
                                                }
                                                else{console.log(err+"10 main")}
                                            })
                                           
                                        }
                                        else {
                                            
                                            resp.send("Please enter the registered Email address and try again.")
                                            console.log(err+"11")
                                        }
                                    })
                    
                            }
                           
                        }
                
                        
                    }
                }
                else{
                    resp.send("Please enter registered email!")
                    console.log(err+"12")
                }
            }
        }
        catch{
            resp.send("Main Cloud Error!")
            console.error()
        }
        
    })

    
})

// Update Volunteer KYC Details
app.post("/volkyc-update", async function (req, resp) {
    let userkycEmail = req.body.userkycEmail;
    let userkycName = req.body.userkycName;
    let userkycContact = req.body.userkycContact;
    let userkycAddress = req.body.userkycAddress;
    let userkycCity = req.body.userkycCity;
    let userkycGender = req.body.userkycGender;
    let userkycDob = req.body.userkycDob;
    let userkycQual = req.body.userkycQual;
    let userkycOccupation = req.body.userkycOccupation;
    let userkycOinfo = req.body.userkycOinfo;
    let userkycPpic = req.files.userkycPpic;
    let userkycIDproof = req.files.userkycIDproof;
    // console.log(userkycPpic)
    // console.log(userkycIDproof)
    // console.log(userkycPpic)
    // console.log(userkycIDproof)
    // let fileNamePpic;
    // let fileNameID;
// ----------------------------------------------------------
    let NewuserkycEmail;
    let NewuserkycName;
    let NewuserkycContact;
    let NewuserkycAddress;
    let NewuserkycCity;
    let NewuserkycGender;
    let NewuserkycDob;
    let NewuserkycQual;
    let NewuserkycOccupation;
    let NewuserkycOinfo;
    let NewuserkycPpic;
    let NewuserkycIDproof;

    // console.log(userkycEmail)
    mysqlserver.query("select * from volkyc where emailid=?",[userkycEmail],function(err,res3){
        console.log(res3)
        if(res3.length==0){
            resp.send("Fill the required data")
        }
        else{
            NewuserkycEmail = res3[0].emailid;
            NewuserkycName = res3[0].fullname;
            NewuserkycContact = res3[0].contact;
            NewuserkycAddress = res3[0].address;
            NewuserkycCity = res3[0].city;
            NewuserkycGender = res3[0].gender;
            NewuserkycDob = res3[0].dob;
            NewuserkycQual = res3[0].quali;
            NewuserkycOccupation = res3[0].occu;
            NewuserkycOinfo = res3[0].info;
            NewuserkycPpic = res3[0].picpath;
            NewuserkycIDproof = res3[0].idpath;
            // checking if any value is null
            NewuserkycEmail = (userkycEmail != null && userkycEmail !== '') ? userkycEmail : NewuserkycEmail;
            NewuserkycName = (userkycName != null && userkycName !== '') ? userkycName : NewuserkycName;
            NewuserkycContact = (userkycContact != null && userkycContact !== '') ? userkycContact : NewuserkycContact;
            NewuserkycAddress = (userkycAddress != null && userkycAddress !== '') ? userkycAddress : NewuserkycAddress;
            NewuserkycCity = (userkycCity != null && userkycCity !== '') ? userkycCity : NewuserkycCity;
            NewuserkycGender = (userkycGender != null && userkycGender !== '') ? userkycGender : NewuserkycGender;
            NewuserkycDob = (userkycDob != null && userkycDob !== '') ? userkycDob : NewuserkycDob;
            NewuserkycQual = (userkycQual != null && userkycQual !== '') ? userkycQual : NewuserkycQual;
            NewuserkycOccupation = (userkycOccupation != null && userkycOccupation !== '') ? userkycOccupation : NewuserkycOccupation;
            NewuserkycOinfo = (userkycOinfo != null && userkycOinfo !== '') ? userkycOinfo : NewuserkycOinfo;
            NewuserkycPpic = (userkycPpic != null && userkycPpic !== '') ? userkycPpic : NewuserkycPpic;
            NewuserkycIDproof = (userkycIDproof != null && userkycIDproof !== '') ? userkycIDproof : NewuserkycIDproof;
        }
    })

    mysqlserver.query("select email from UserSignUp  where email=?",[userkycEmail],async function(err,resMain){
        // console.log("resultMain "+JSON.stringify(resMain))
        try{
            console.log(userkycEmail)
            if(!userkycEmail){
                resp.send("Please enter valid email.")
            }
            else{
                if(resMain[0].email==userkycEmail){
                    console.log(err+"1")
                    // resp.send("Email is verified!")
                    if (!userkycEmail) {
                        resp.send("Enter valid details!")
                        console.log(err+"2")
                    }
                    else {
                        console.log(err+"3")
                        if (!req.files) {
                            fileNamePpic = "nopic.jpg";
                            fileNameID = "nopic2.jpg";
                            resp.send("files not uploaded")
                            // console.log(fileNameID + " " + fileNamePpic)
                            console.log(err+"4")
                        }
                        else {console.log(err+"5")
                            {
                                NewuserkycPpic = req.files.userkycPpic.name;
                                let locationToSavePpic = __dirname + "/public/uploads/" + NewuserkycPpic;//full ile path
                                req.files.userkycPpic.mv(locationToSavePpic);//saving file in uploads folder
                    
                                //saving ur file/pic on cloudinary server
                                await cloudinary.uploader.upload(locationToSavePpic).then(function (picUrlResultPpic) {
                                    NewuserkycPpic = picUrlResultPpic.url;   //will give u the url of ur pic on cloudinary server
                                    console.log(NewuserkycPpic);
                                });
                                NewuserkycIDproof = req.files.userkycIDproof.name;
                                let locationToSaveID = __dirname + "/public/uploads/" + NewuserkycIDproof;//full ile path
                                req.files.userkycIDproof.mv(locationToSaveID);//saving file in uploads folder
                                
                                // 2 second delay for the next upload
                                await new Promise(resolve => setTimeout(resolve, 2000)); 
                    
                                //saving ur file/pic on cloudinary server
                                await cloudinary.uploader.upload(locationToSaveID).then(function (picUrlResultIDproof) {
                                    NewuserkycIDproof = picUrlResultIDproof.url;   //will give u the url of ur pic on cloudinary server
                                    console.log(NewuserkycIDproof);
                                    console.log(err+"6")
                                });
                                mysqlserver.query("select email,emailid from UserSignUp INNER JOIN volkyc ON UserSignUp.email=volkyc.emailid where volkyc.emailid=?",
                                    [userkycEmail], function (err, res) {
                                        console.log(err+"7")
                                        console.log(res)
                                        if (res.length!=0) {
                                            console.log(err+"8")
                                            mysqlserver.query("UPDATE volkyc set fullname=?, contact=?, address=?, city=?, gender=?, dob=?, quali=?, occu=?, info=?, picpath=?, idpath=? WHERE emailid=?", [
                                                NewuserkycName,
                                                NewuserkycContact,
                                                NewuserkycAddress,
                                                NewuserkycCity,
                                                NewuserkycGender,
                                                NewuserkycDob,
                                                NewuserkycQual,
                                                NewuserkycOccupation,
                                                NewuserkycOinfo,
                                                NewuserkycPpic,
                                                NewuserkycIDproof,
                                                userkycEmail
                                            ], function (err, res2) {
                                                if(!err){
                                                    console.log(err+"9")
                                                resp.send("KYC Updated Completed successfully!")
                                                }
                                                else{console.log(err+"10 main")}
                                            })
                                           
                                        }
                                        else {
                                            
                                            resp.send("Please enter the registered Email address and try again.")
                                            console.log(err+"11")
                                        }
                                    })
                    
                            }
                           
                        }
                
                        
                    }
                }
                else{
                    resp.send("Please enter registered email!")
                    console.log(err+"12")
                }
            }
        }
        catch{
            resp.send("Main Cloud Error!")
            console.error()
        }
        
    })
})

// VOLUNTEER KYC FORM EMAIL VALIDATION ON BLUR - Backend
app.get("/volkyc-email-check",function(req,resp){
    let userkycEmail=req.query.userkycEmail;
    mysqlserver.query("select email from UserSignUp where email=?",[userkycEmail],function(err,res){
        
        if(userkycEmail==0){
            resp.send("Please enter valid email.")
        }
        else{
            if(res.affectedRows!=0){
                resp.send("Email is verified!")
            }
            else{
                resp.send("Please enter registered email!")
            }
        }
    })
})