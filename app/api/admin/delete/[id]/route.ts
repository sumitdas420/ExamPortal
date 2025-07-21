import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const token = cookies().get('admin_token')?.value;

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };

    if (decoded.role !== 'super_admin') {
      return new Response('Forbidden: Only super admins can delete admins', { status: 403 });
    }

    await prisma.admin.delete({
      where: { id: params.id },
    });

    return new Response('Admin deleted successfully');
  } catch (error) {
    return new Response('Invalid token or server error', { status: 401 });
  }
}
