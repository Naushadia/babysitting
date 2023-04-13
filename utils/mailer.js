const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "napoleon77@ethereal.email",
    pass: "fXU951Yv9jHU7HJSJR",
  },
});

//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     service : 'Gmail',

//     auth: {
//       user: 'Your email',
//       pass: 'your password',
//     }

module.exports = transporter;



class Trainer extends Model {}
Trainer.init({
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
}, { sequelize, modelName: 'trainer' });

// Series will have a trainerId = Trainer.id foreign reference key
// after we call Trainer.hasMany(series)
class Series extends Model {}
Series.init({
  title: Sequelize.STRING,
  subTitle: Sequelize.STRING,
  description: Sequelize.TEXT,
  // Set FK relationship (hasMany) with `Trainer`
  trainerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Trainer,
      key: 'id'
    }
  }
}, { sequelize, modelName: 'series' });

(i.e., the foreignKey defines the key for the source model in the through relation, and otherKey defines it for the target model):

foreignKey: 'authorId', // Specify the foreign key on the Post model
  otherKey: 'id' // Specify the primary key on the User model

  User.belongsToMany(Role, {
    through: User_Role, // Specify the junction table name
    foreignKey: 'userId', // Specify the foreign key on the User_Role model
    otherKey: 'roleId', // Specify the other foreign key on the User_Role model
    targetKey: 'username' // Specify the target key on the User model
  });
  Role.belongsToMany(User, {
    through: User_Role, // Specify the junction table name
    foreignKey: 'roleId', // Specify the foreign key on the User_Role model
    otherKey: 'userId', // Specify the other foreign key on the User_Role model
    targetKey: 'description' // Specify the target key on the Role model
  });