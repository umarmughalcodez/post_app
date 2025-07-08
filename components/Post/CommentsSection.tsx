import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BsFillSendFill } from "react-icons/bs";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MdClose, MdEdit } from "react-icons/md";
import { useRouter } from "next/navigation";

interface CommentSectionProps {
  postId: string;
}

interface CommentProps {
  id: string;
  text: string;
  postid: string;
  userEmail: string;
  user: {
    username: string;
  };
  created_at: string;
}

const CommentsSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [text, setText] = useState("");
  const [editedText, setEditedText] = useState("");
  const [comments, setComments] = useState<CommentProps[]>([]);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const handleAddComment = async () => {
    const res = await fetch("/api/posts/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, postId }),
    });
    setText("");

    if (res.ok) {
      toast.success("Comment Added Successfully");
      fetchComments();
    } else {
      toast.error("Failed to add comment!");
    }
  };

  const fetchComments = async () => {
    const res = await fetch(`/api/posts/comment?postId=${postId}`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments);
    }
  };

  const handleEditComment = async () => {
    try {
      const res = await fetch("/api/posts/comment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editedText, postId }),
      });

      if (res.ok) {
        toast.success("Comment Updated Successfully");
        fetchComments();
        setShowEditPopup(false);
      } else {
        toast.error("Failed to update comment!");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <>
      <div className="w-[50%] h-full mt-5 mb-5 border-black border flex items-center justify-center p-3 relative">
        <Input
          placeholder="Write a comment..."
          className="m-3 w-[90%]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
        />
        <Button disabled={text.length == 0} onClick={handleAddComment}>
          <BsFillSendFill />
        </Button>
      </div>
      <div className="mt-5 mb-12 w-[50%] rounded-xl shadow-lg shadow-[#333] p-2 bg-gray-400">
        <div className="m-3 text-lg">
          {comments.length} &nbsp;
          {comments.length > 1 ? "Comments" : "Comment"}
        </div>
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="flex flex-col relative p-4 bg-white rounded-lg shadow-md space-y-2"
            >
              <span
                className="font-bold hover:underline underline-offset-2 cursor-pointer"
                onClick={() =>
                  router.push(`/profile/public?email=${comment.userEmail}`)
                }
              >
                @{comment.user.username}
              </span>
              <span className="text-center">{comment.text}</span>
              {comment.userEmail === user?.email ? (
                <button
                  className="bg-none text-lg absolute top-2 right-2 bg-white bg-opacity-0 rounded-full p-1 hover:bg-opacity-50 transition-opacity delay-200"
                  onClick={() => {
                    setShowEditPopup(true);
                    setEditedText(comment.text); // Pre-fill the edit popup with the comment text
                  }}
                >
                  <MdEdit />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      {showEditPopup && (
        <div className="fixed top-1/2 left-1/2 bg-gray-300 rounded-xl transform -translate-x-1/2 -translate-y-1/2 shadow-md shadow-[#222] w-[50%] p-5 text-center">
          Edit Comment
          <button
            className="absolute top-3 right-3 text-2xl"
            onClick={() => setShowEditPopup(false)}
          >
            <MdClose />
          </button>
          <div className="flex items-center justify-center">
            <Input
              placeholder="Write a comment..."
              className="m-3 w-[90%]"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              maxLength={1000}
            />
            <Button
              disabled={editedText.length == 0}
              onClick={handleEditComment}
            >
              <BsFillSendFill />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentsSection;
