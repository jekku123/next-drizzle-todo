'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { updateTodo } from '@/lib/actions';
import { Todo } from '@/lib/schema';
import { EditIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';
import { OptimisticTodoAction } from './todos';
import FormButton from './ui/form-button';
import { Input } from './ui/input';

const initialState = {
  message: '',
  error: undefined,
};

type EditTodoProps = {
  todo: Todo;
  setOptimisticTodos: OptimisticTodoAction;
};

export default function EditTodo({ todo, setOptimisticTodos }: EditTodoProps) {
  const [state, formAction] = useFormState(updateTodo.bind(null, todo.id), initialState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state?.message === 'success') {
      setOpen(false);
      toast.success('Todo updated successfully');
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          action={async (formData: FormData) => {
            const newTodo = formData.get('todo') as string;
            if (newTodo) {
              setOptimisticTodos({
                type: 'update',
                todo: { ...todo, todo: newTodo },
              });
            }
            formAction(formData);
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
            <DialogDescription>
              Make changes to todo here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input id="todo" name="todo" defaultValue={todo.todo!} />
            {state?.error && <span className="text-red-500">{state?.error}</span>}
          </div>
          <DialogFooter>
            <FormButton>Save</FormButton>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
