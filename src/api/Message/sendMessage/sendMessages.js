import { prisma } from "../../../../generated/prisma-client";

export default{
    Mutation:{
        sendMessages: async (_, args, { request, isAuthenticated }) => {
            isAuthenticated(request);
            const { user } = request;
            const { roomId, message, toId } = args;
            let room;
            if(roomId === undefined){
                if(user.id !== toId){
                    room = await prisma.createRoom({
                        participants:{
                            connect:[{id:user.id}, {id:toId}]
                        }
                    });
                }
            }else{
                room = await prisma.room({id:roomId});
            }
            
            if(!room){
                throw Error("Room Not Found.");
            }
            const participants = await prisma.room({id:room.id}).participants();
            const getTo = participants.filter(
                participant => participant.id !== user.id
            )[0];

            return prisma.createMessage({
                text:message,
                from:{
                    connect:{
                        id:user.id
                    }
                },
                to:{
                    connect:{
                        id: roomId ? getTo.id : toId
                    }
                },
                room:{
                    connect:{
                        id:room.id
                    }
                }
            });
        }
    }
}