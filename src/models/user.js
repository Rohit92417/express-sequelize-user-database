module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      user_id: {
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        allowNull:false,
        primaryKey:true
      },
      user_name: {
        type: Sequelize.STRING(100),
      },
      user_email: {
        type: Sequelize.STRING(100),
        unique:true,
      },
      user_password: {
        type: Sequelize.STRING(100),
        
      },
      user_image:{ 
        type: Sequelize.STRING,
       
      },         
      total_orders: {
        type:Sequelize.INTEGER,
       
      }
    });
    return User;
  };