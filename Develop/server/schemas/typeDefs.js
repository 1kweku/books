const typeDefs = gql`
  type Book {
    _id: ID
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type User {
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
    addProfile(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

    addSkill(profileId: ID!, skill: String!): Profile
    removeProfile: Profile
    removeSkill(skill: String!): Profile
  }
`;

module.exports = typeDefs;
