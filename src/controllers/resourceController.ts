import { Request, Response } from 'express';
import {
  createResource,
  getResources as getResourcesService,
  updateResource as updateResourceService,
  deleteResource as deleteResourceService
} from '../services/resourceService';

// Thêm tài liệu vào môn học
export const addResourceToSubject = async (req: Request, res: Response) => {
  const { subjectId } = req.params;
  const { title, description, fileUrls, type, allowedRoles } = req.body;

  try {
    const resource = await createResource(
      subjectId,
      title,
      description,
      fileUrls,
      type,
      allowedRoles
    ); // Tạo tài liệu mới

    res.status(201).json(resource); // Trả về tài liệu vừa tạo
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Lấy danh sách tài liệu với phân trang
export const getResourcesForSubject = async (req: Request, res: Response) => {
  const { subjectId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const resourcesData = await getResourcesService(subjectId, Number(page), Number(limit)); // Gọi service

    res.status(200).json(resourcesData); // Trả về dữ liệu phân trang
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Cập nhật tài liệu
export const updateResource = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, fileUrls, type, allowedRoles } = req.body;

  try {
    const resource = await updateResourceService(id, {
      title,
      description,
      fileUrls,
      type,
      allowedRoles,
    }); // Cập nhật tài liệu

    if (!resource) return res.status(404).json({ message: 'Tài liệu không tồn tại' });

    res.status(200).json(resource); // Trả về tài liệu vừa cập nhật
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};

// Xóa tài liệu
export const deleteResource = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const resource = await deleteResourceService(id); // Gọi hàm từ service để xóa tài liệu

    if (!resource) return res.status(404).json({ message: 'Tài liệu không tồn tại' });

    res.status(200).json({ message: 'Tài liệu đã được xóa' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};
