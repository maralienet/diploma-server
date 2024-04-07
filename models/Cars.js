module.exports = (sequelize, DataTypes) => {
    const Cars = sequelize.define('Cars', {
        gosNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
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

    return Cars;
}