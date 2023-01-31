const { AuthenticationError } = require("apollo-server-express");
//const { Profile } = require('../models');
const { Book, User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async () => {
      return User.find();
    },

    user: async (parent, { profileId }) => {
      return User.findOne({ _id: profileId });
    },
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, { name, email, password }) => {
      const user = await User.create({ name, email, password });
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No profile with this email found!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },

    // Add a third argument to the resolver to access data in our `context`
    addBook: async (parent, { userId, book }, context) => {
      // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
      if (context.book) {
        return Book.findOneAndUpdate(
          { _id: userId },
          {
            $addToSet: { books: book },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError("You need to be logged in!");
    },
    // Set up mutation so a logged in user can only remove their profile and no one else's
    removeUser: async (parent, args, context) => {
      if (context.book) {
        return Book.findOneAndDelete({ _id: context.book._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // Make it so a logged in user can only remove a bookc from their own profile
    removeBook: async (parent, { book }, context) => {
      if (context.book) {
        return Profile.findOneAndUpdate(
          { _id: context.book._id },
          { $pull: { books: book } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
