import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface CommentDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  comment: string;
  setComment: (comment: string) => void;
  onAddComment: () => void;
}

export default function CommentDialog({
  isOpen,
  setIsOpen,
  comment,
  setComment,
  onAddComment,
}: CommentDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Admin Note</AlertDialogTitle>
          <AlertDialogDescription>
            Add a note to this order. This will be visible to other
            administrators.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment..."
            className="mt-2"
            rows={5}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onAddComment} disabled={!comment.trim()}>
            Add Comment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
