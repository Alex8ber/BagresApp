import { deleteTeacher, deleteStudent } from '../admin';
import { supabase } from '../client';

jest.mock('../client', () => ({
  supabase: {
    rpc: jest.fn(),
    from: jest.fn(),
  },
}));

describe('admin user deletion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deleteTeacher uses the admin RPC to remove the teacher profile', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: true, error: null });

    await deleteTeacher('teacher-1');

    expect(supabase.rpc).toHaveBeenCalledWith('admin_delete_teacher_profile', {
      p_teacher_id: 'teacher-1',
    });
  });

  it('deleteStudent uses the admin RPC to remove the student profile', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: true, error: null });

    await deleteStudent('student-1');

    expect(supabase.rpc).toHaveBeenCalledWith('admin_delete_student_profile', {
      p_student_id: 'student-1',
    });
  });
});
