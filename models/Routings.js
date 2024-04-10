module.exports = (sequelize, DataTypes) => {
    const Routings = sequelize.define('Routings', {
        routeId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        carId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        route:{
            type: DataTypes.STRING,
            allowNull: false
        
        },
        length:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        duration:{
            type: DataTypes.STRING,
            allowNull: false
        
        }
    })

    return Routings;
}