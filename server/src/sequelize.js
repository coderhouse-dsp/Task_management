require("dotenv/config");
const sequelize = require("sequelize");
const { Sequelize, DataTypes } = require("sequelize");

const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    quoteIdentifiers: false,
    underscored: true,
  }
);

const UserData = connection.define("userdata", {
  userid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  firstname: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
},{
    connection,
    schema:'',
    tableName:'userdata',
    timestamps:false
});

const TaskData = connection.define("taskdata",{
  refid:{
    type:DataTypes.INTEGER,
    allowNull:false,
    references: {
      model: UserData,
      key: 'userid'
    }
  },
  taskid:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
    allowNull:false,
  },
  title:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  description:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  duedate:{
    type:DataTypes.DATE,
    allowNull:false
  },
  status:{
    type:DataTypes.TEXT,
    allowNull:true
  }
},{
  connection,
  schema:'',
  tableName: 'taskdata',
  timestamps:false
})

TaskData.belongsTo(UserData, { foreignKey: 'refid' });

console.log(UserData === sequelize.Model.userdata)
module.exports = {
  connection,
  UserData,
  TaskData
};
