
module.exports = function(sequelize, DataTypes) {

return sequelize.define('tbl_role', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    get() {
      return this.getDataValue('id');
    },
    set(val) {
      this.setDataValue('id', val);
    }
  },
  name: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
    get() {
      return this.getDataValue('name');
    },
    set(val) {
      this.setDataValue('name', val);
    }
  },
  createdDate: {
    type: DataTypes.DATE,
    required: false,
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
  createdBy: {
    type: DataTypes.BIGINT,
    required: true,
    get() {
      return this.getDataValue('createdBy');
    },
    set(val) {
      this.setDataValue('createdBy', val);
    },
  },
  updatedBy: {type: DataTypes.BIGINT},
  updatedDate: {
    type: DataTypes.DATE,
    required: false,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    get() {
      var date = new Date(this.getDataValue("updatedDate"));
      return date.getTime();
    },
    set(val) {
      this.setDataValue("updatedDate", val);
    }
  },
  active:{
    type: DataTypes.TINYINT,
    required: true,
    defaultValue:1
  },
},
  {
    tableName: 'tbl_role',
    timestamps:false
  });

  /*
== Modifications ==
1. set method has different fieldname
2. naming convention of file
*/
};

