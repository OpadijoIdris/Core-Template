import { 
            getUserService, 
            getAllUsersService, 
            updateUserService, 
            deleteUserService,
            uploadAvatarService 
        } from "../services/user.services.js";

export const getUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await getUserService(userId);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        };

        return res.status(200).json({
            success: true,
            data: user
        })
        
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message
        })
    }
};

export const getAllUser = async (req, res) => {
    try {
        const users = await getAllUsersService();
        if(!users){
            return res.status(400).json({
                success: false,
                message: "Something went wrong"
            })
        };
        res.status(200).json({
            success: true,
            data: users
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const updateUser = async (req, res) => {
    try {
        const id = req.user.id;
        const data = req.body;
        const currentUserRole = req.user?.role;

        // Only the Admin and Super_Admin can change or alter the user role
        if (data.role && (currentUserRole !== "ADMIN" && currentUserRole !== "SUPER_ADMIN")) {
            return res.status(403).json({
                success: false,
                message: "You cannot change your role. Only admins can do this."
            });
        }

        const updated = await updateUserService(id, data);
        if(!updated){
            return res.status(400).json({
                success: false,
                message: "Something went wrong"
            })
        };
        res.status(200).json({
            success: true,
            data: updated
        })

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userIdToDelete = req.params.id;
        const currentUserId = req.user?.id;
        const currentUserRole = req.user?.role;

       
        const isOwnAccount = currentUserId === userIdToDelete;
        const isAdmin = currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN";

        if (!isOwnAccount && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only delete your own account or you must be an admin"
            });
        }

        await deleteUserService(userIdToDelete);
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
        
    } catch (error) {
       res.status(500).json({
            success: false,
            message: error.message
       }); 
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user.id;
        const file = req.file;

        const user = await uploadAvatarService (userId, file);
        if(!user) {
            return res.status(400).json({
                message: "Could not upload avatar"
            })
        };
        res.status(200).json({
            message: "Avatar uploaded successfully",
            user
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Avatar upload failed"
        })
    }
}

