module.exports = function User(sequelize, DataTypes) {
  return sequelize.define(
    "tbl_user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        required: false
      },
      password: { type: DataTypes.STRING },
      userName: { type: DataTypes.STRING },
      emailId: { type: DataTypes.STRING },
      mobileNumber: { type: DataTypes.STRING },
      createdDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        get() {
          var date = new Date(this.getDataValue("createdDate"));
          return date.getTime();
        },
        set(val) {
          this.setDataValue("createdDate", val);
        }
      },
      active: { type: DataTypes.TINYINT, defaultValue: 1, allowNull: false },
      roleId: { type: DataTypes.INTEGER, allowNull: false },

    },

    { tableName: "tbl_user", timestamps: false }
  );
};
