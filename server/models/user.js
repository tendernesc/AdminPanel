const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {}

  User.init(
    {
      name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: {
          isEmail: true // Проверка на корректность email
        }
      },
      password: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      lastLogin: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
      },
      status: { 
        type: DataTypes.STRING, 
        defaultValue: "active" 
      }
    },
    {
      sequelize,
      modelName: "User",
      indexes: [
        {
          unique: true,
          fields: ["email"] // Индекс на поле email для уникальности
        }
      ]
    }
  );

  return User;
};
