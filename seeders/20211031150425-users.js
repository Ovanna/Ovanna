"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     *
     */
    const password = "1234567890";
    const hashPassword = await bcrypt.hash(password, 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin@gmail.com",
          fullName: "admin",
          status: "admin",
          password: hashPassword,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
