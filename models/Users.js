module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        surname:{
            type: DataTypes.STRING,
            allowNull: false    
        },
        login:{
            type: DataTypes.STRING,
            allowNull: false    
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false    
        },
        role:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    return Users;
}