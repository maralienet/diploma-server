module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        gosNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        brand:{
            type: DataTypes.STRING,
            allowNull: false    
        },
        capacity:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    return Users;
}