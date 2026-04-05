import CreatePostModal from "@/components/feed/createPostModal/CreatePostModal";
import Button from "@/components/ui/button/Button";
import { createPost } from "@/services/api";
import { useUserStore } from "@/store/useUserStore";
import { message } from "antd";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

export const AddPost = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const userInfo = useUserStore((state) => state.info);
    const userAccess = useUserStore((state) => state.userData)?.token_type;
    const [openCreatePost, setOpenCreatePost] = useState(false);
    const [sumbitLoading, setSubmitLoading] = useState(false);

    const handleCreatePost = (body, attachment) => {
        setSubmitLoading(true);
        createPost({
          type_id: attachment?.[0]?.type === "image" ? 1 : 2,
          caption: body,
          media: attachment?.[0]?.file,
          visibility_id: 1,
          title: "",
        })
          .then((res) => {
            setOpenCreatePost(false);
            setSubmitLoading(false);
            messageApi.success("تم إنشاء المنشور بنجاح!");
          })
          .catch((err) => {
            setSubmitLoading(false);
          });
      };
    

    return(
        <>
        {contextHolder}

<CreatePostModal
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
        userName="محمد أحمد"
        submitting={sumbitLoading}
        value={""}
        onSubmit={(body, attachment) => {
          handleCreatePost(body, attachment);
        }}
      />
         {userInfo?.user?.user_role == 1 && userAccess == "FULL_ACCESS" ? (
            <Button
              onClick={() => {
                setOpenCreatePost(true);
              }}
              icon={<FiPlus />}
            >
              اضافة منشور
            </Button>
          ) : null}
        </>
    )
}