//Mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType,
} = require('graphql');

// const deleteClientsProject = async () => {
    
// }

//Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        status: {type: GraphQLString},
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId);
            }
        },
    })
});

//Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
    })
});

// -------------------------------------------------------------

//Queries - for retrieving data
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //PROJECT QUERIES
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find();
            }
        },
        project: {
            type: ProjectType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args) {
                return Project.findById(args.id);
            }
        },
        //CLIENT QUERIES
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find();
            }
        },
        client: {
            type: ClientType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args) {
                return Client.findById(args.id);
            }
        }
    }
});

//Mutations - used for changing data in any way
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //CLIENT MUTATIONS
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },  //GraphQLNonNull forces the field to have data(can't be empty)
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return client.save();
            }
        },
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                Project.find({ clientId: args.id }).then(async (projects) => {
                    for(const project of projects) {
                        await project.deleteOne();
                    }
                });
                return Client.findByIdAndDelete(args.id);
            }
        },
        // PROJECT MUTATIONS
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }, 
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            new: { value: 'Not Started' },
                            progress: { value: 'In Progress'},
                            completed: { value: 'Completed'},
                        }
                    }),
                    defaultValue: 'Not Started',
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                });
                return project.save();
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Project.findByIdAndDelete(args.id);
            },
        },
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID)},
                name: { type: GraphQLString},
                description: { type: GraphQLString},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',    //needs to be a unique name
                        values: {
                            new: { value: 'Not Started' },
                            progress: { value: 'In Progress'},
                            completed: { value: 'Completed'},
                        }
                    }),
                },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status,
                        },
                    },
                    { new: true }   //means if the project doesn't exist already, it will create a new Project
                );
            },
        }
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation,
});

