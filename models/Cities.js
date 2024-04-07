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
            type: DataTypes.INTEGER,
            allowNull: false
        },
        longitude:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    return Cities;
}