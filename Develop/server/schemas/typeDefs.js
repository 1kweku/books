const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Book {
    _id: ID
    authors: String!
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Query {
    books: [Book]!
    users: [User]!
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

    addBook(userId: ID!, book: String!): User
    removeUser: User
    removeBook(book: String!): User
  }
`;

module.exports = typeDefs;
