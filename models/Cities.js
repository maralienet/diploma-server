module.exports = (sequelize, DataTypes) => {
    const Cities = sequelize.define('Cities', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        district:{
            type: DataTypes.STRING,
            allowNull: false
        
        },
        region:{
            type: DataTypes.STRING,
            allowNull: false
        },
        wikiDataId:{
            type: DataTypes.STRING,
            allowNull: false
        },
        latitude:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        longitude:{
            type: DataTypes.DOUBLE,
            allowNull: false
        }
    })

    return Cities;
}