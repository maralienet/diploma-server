module.exports = (sequelize, DataTypes) => {
    const Cities = sequelize.define('Cities', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false
        
        },
        region:{
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return Cities;
}