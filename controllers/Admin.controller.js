const User = require('../models/user.model');
const constant = require('../util/constant')
const bcrypt = require('bcryptjs');
const objectConverter = require('../util/objectConverter');




// const createAdmin = async (req, res) => {

//     try {
//         let user = await User.findOne({ userTypes: constant.userTypes.admin })

//         if (user) {
//             console.log('Admin Already Created', user);

//             return res.status(201).send({
//                 message: 'Admin already created'
//             });
//         }


//         let obj = {
//             email: req.body.email ? req.body.email : undefined,
//             password: req.body.password ? bcrypt.hashSync(req.body.password) : undefined,
//             userName: 'Admin',
//             userTypes: constant.userTypes.admin

//         }
//         if (req.file) {
//             const { filename, path } = req.file;
//             obj["image"] = {
//                 fileName: filename,
//                 fileAddress: path
//             }
//         }

//         console.log(obj);
//         await User.create(obj);
//         res.status(200).send({
//             errorCode: 200,
//             message: 'Admin Got Created'
//         })
//         console.log('Admin got created');



//     } catch (err) {
//         console.log(err);
//         res.status(500).send({
//             errorCode: 500,
//             message: 'Internal Error while creating Admin'
//         })
//     }
// }
const getList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skipIndex = (page - 1) * limit;
        const searchQuery = req.query.search || ''; 

        let obj = {
            userTypes: constant.userTypes.customer,
            otpVerifly: true
        };

        if (searchQuery) {
            obj.$or = [
                { username: { $regex: searchQuery, $options: 'i' } }, 
                { email: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        const users = await User.find(obj)
            .limit(limit)
            .skip(skipIndex)
            .lean(); 

        const totalCount = await User.countDocuments(obj); 

        console.log('users', users)
        return res.status(200).send({
            status: 200,
            message: 'Users retrieved successfully',
            users: users,
            total_users: totalCount, 
            total_pages: Math.ceil(totalCount / limit),
            current_page: page
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            status: 500,
            message: 'Internal Server Error',
            error: err.message
        });
    }
};

const update = async (req, res) => {
    try {
        const adminId = req.userId;
        const { firstName, lastName, address, mobileNo } = req.body;
        console.log(req.body, "================================>")
        const admin = await User.findOne({ _id: adminId });

        if (!admin) {
            return res.status(404).json({
                error_code: 404,
                message: 'Admin not found'
            });
        }
        const obj = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            mobileNo: mobileNo
        }
        // console.log("🚀 ~ update ~ obj:", obj)
        await User.findOneAndUpdate({ _id: adminId }, obj);
        const updatedAdmin = await User.findOne({ _id: adminId });
        // console.log("🚀 ~ update ~ updatedAdmin:", updatedAdmin)

        return res.status(200).json({
            error_code: 200,
            message: 'Admin profile updated successfully',
            admin: updatedAdmin
        });
    } catch (error) {
        console.error('Error inside update admin:', error);
        return res.status(500).json({
            error_code: 500,
            message: "Internal Server Error"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const adminId = req.userId;
        console.log("🚀 ~ updateProfile ~ adminId:", adminId)
        
        if (!adminId) {
            return res.status(404).json({
                error_code: 404,
                message: 'Admin not found'
            });
        }
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imagePath = `uploads/${req.file.filename}`;
        const imageUrl = `${baseUrl}/${imagePath}`;

        // Construct the updateFields object with the image details
        const updateFields = {
            image: {
                fileName: req.file.filename,
                fileAddress: imagePath
            },
            imageUrl:imageUrl
        };

        // Update the admin profile with the new image details
        const updatedAdmin = await User.findOneAndUpdate({ _id: adminId }, updateFields, { new: true });


        return res.status(200).json({
            error_code: 200,
            message: 'Admin profile updated successfully',
            admin: {
                ...updatedAdmin.toObject(),
                imageUrl: imageUrl
            }
        });
    } catch (error) {
        console.error('Error inside updateProfile:', error);
        return res.status(500).json({
            error_code: 500,
            message: "Internal Server Error"
        });
    }
};

const adminProfile =async (req,res)=>{
    try {

        const adminId = req.userId;
        console.log("��� ~ adminProfile ~ adminId:", adminId)

        if (!adminId) {
            return res.status(404).json({
                error_code: 404,
                message: 'Admin not found'
            });
        }

        const userData = await User.findOne({ _id: adminId });
        if (!userData) {
            return res.status(400).send({
                error_code: 400,
                message: 'User not found'
            });
        }
        console.log("��� ~ adminProfile ~ userData:", userData)
        return res.status(200).send({
            error_code: 200,
            message: 'Admin profile retrieved successfully',
            admin: userData
        });

        
    } catch (error) {
        console.error('Error inside adminProfile:', error);
        return res.status(500).json({
            error_code: 500,
            message: "Internal Server Error"
        });
        
    }
}




const userStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const userData = await User.findById(id);
        if (!userData) {
            return res.status(400).send({
                error_code: 400,
                message: 'User not found'
            });
        }
        userData.status = userData.status === 'Active' ? 'Deactive' : 'Active';

        await userData.save();

        res.status(200).send({
            message: `User status toggled successfully to ${userData.status}`,
            user: userData
        });
    } catch (err) {
        console.error('Error inside update admin', err);
        res.status(500).send({
            error_code: 500,
            message: 'Internal Server Error'
        });
    }
};


const changePassword = async (req, res) => {
    try {
        const userId = req.userId;
        console.log("🚀 ~ changePassword ~ userId:", userId)

        const userData = await User.findOne({ _id: userId });
        console.log("🚀 ~ changePassword ~ userData:", userData)
        if (!userData) {
            return res.status(404).json({
                error_code: 404,
                message: 'User not found'
            });
        }
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                error_code: 400,
                message: 'New password and confirm password do not match'
            });
        }
        const isMatch = await bcrypt.compare(oldPassword, userData.password);
        if (!isMatch) {
            return res.status(400).json({
                error_code: 400,
                message: 'Old password is incorrect'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        userData.password = hashedPassword;

        await userData.save();

        return res.status(200).json({
            message: 'Password changed successfully',
            user: userData
        });
    } catch (error) {
        console.error('Error inside changePassword controller', error);
        return res.status(500).json({
            error_code: 500,
            message: 'Internal Server Error'
        });
    }
};




module.exports = {
    // createAdmin,
    updateProfile,
    getList,
    adminProfile,
    update, userStatus,
    changePassword
}