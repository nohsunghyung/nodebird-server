module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(40), // 40자 이내
      allowNull: false, //필수
      // unique: true, // 중복금지
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },{ // 테이블에 대한 설정
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  })
  User.associate = (db) => {
    
  };
  return User;
}