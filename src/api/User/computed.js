import { prisma } from "../../../generated/prisma-client";

export default{
    User:{
        fullName: parent => {
            return `${parent.firstName} ${parent.lastName}`;
        },
        isFollowing: (parent, _, { request }) => {
            const { user } = request;
            const { id:parentId } = parent;
            try{
                return prisma.$exists.user({
                    AND:[
                        { id: parentId },
                        { followers_some: { id:user.id } }
                    ]
                });
            }catch(e){
                console.log(e);
                return false;
            }
        },
        isSelf: (parent, _, { request }) => {
            const { user } = request;
            const { id:parentId } = parent;
            return user.id === parentId;
        }
    }
}