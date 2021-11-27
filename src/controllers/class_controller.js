const Class = require("../models/class.model");

/**
 * Function to generate classCode - 
 * @returns string Code
 */
classCodeGenerator = () => {
    let code = "";
    let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let length = characters.length;
    for (let i = 0; i < 7; i++)
        code += characters.charAt(Math.floor(Math.random() * length));
    return code;
};

/**
 * Function to create a class by Faculty - 
 * @async
 * @method
 * @params req, res
 * @returns details of new class
 */
exports.create_Class = async (req, res) => {
    classCode = classCodeGenerator();
    let newClass = new Class({
        facultyId: req.user.email,
        className: req.body.className,
        subjectCode: req.body.subjectCode,
        classCode: classCode,
    });

    try {
        await newClass.save();
        return res.status(201)
            .send({
                message: "Class Created Successfully",
                classCode: classCode,
                details: newClass
            });

    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: err });
    }
};

/**
 * Function to display classes created by faculty - 
 * @async
 * @method
 * @params req, res
 * @returns list of classes
 */
exports.Facultyclasses = async (req, res) => {
    try {
        var classes = await Class.find({ facultyId: req.user.email });
        if (!classes)
            return res.status(200).json({ message: "Not created any class" });
        res.status(200).json(classes);
    }
    catch {
        return res.status(400).json({ error: "Error Occured!" });
    };
};

/**
 * Function to join a class by student given it's classcode - 
 * @async
 * @method
 * @params req, res
 * @returns updated class details
 * @throws
 *    404: Invalid class Code
 *    400: User already in class.
 */
exports.joinClass = async (req, res) => {
    const classCode = req.body.classCode;
    const userId = req.user._id.toString();
    try {
        var theClass = await Class.findOne({ classCode });
        if (!theClass) {
            return res.status(404).json({ message: "Invalid Class Code" });
        }
        theClass.students.map((studentId) => {
            if (studentId === userId) {
                throw new Error("User already in the class!")
            }
        });
        theClass = await Class.findOneAndUpdate(
            { classCode: classCode },
            { $push: { students: userId } },
            { new: true }) //to return updated class.
        if (!theClass) {
            return res.status(400).json({ message: "Error Occured" });
        }
        return res.status(200).json({
            message: "Added to class",
            class: theClass
        });
    }
    catch (e) {
        res.status(400).json("Error: " + e);
    }
};

/**
 * Function to display classes joined by user - 
 * @async
 * @method
 * @params req, res
 * @returns list of classes
 */
exports.Studentclasses = async (req, res) => {
    try {
        var classes = await Class.find({ students: req.user._id });
        if (!classes)
            return res.status(200).json({ message: "Not in any class" });
        res.status(200).json(classes);
    }
    catch {
        return res.status(400).json({ error: "Error Occured!" });
    };
};

/**
 * Function to give details of the class - 
 * @async
 * @method
 * @params req, res
 * @returns details of the class found
 * @throws
 *    404: Class not found
 */
exports.singleClass = async (req, res) => {
    try {
        var room = await Class.find({ classCode: req.params.classCode });
        if (room.length < 1) {
            return res.status(404).json({ error: "Class Not Found" });
        }
        return res.status(200).json({
            message: "Class Found",
            details: room,
        });
    }
    catch {
        return res.status(400).json({ error: "Error Occured!" });
    };
};

/**
 * Function to display details of students in the given class - 
 * @async
 * @method
 * @params req, res
 * @returns list of details of students
 * @throws
 *    400: Invalid class Code
 */
exports.displayStudents = async (req, res) => {
    try {
        const classCode = req.params.classCode;
        var classDetail = await Class.findOne({ classCode: classCode });
        if (!classDetail)
            return res.json(400).json({ message: "Invalid ClassCode" });
        return res.status(200).json({
            message: `Displaying Details of Student in the Class with Code: ${classCode}`,
            students: classDetail.students,
        });
    }
    catch {
        return res.status(400).json({ error: "Error Occured!" });
    };
}