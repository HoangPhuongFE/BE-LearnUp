import { Request, Response } from 'express';
import Resource from '../models/Resource';
import {
  createResource,
  getResources as getResourcesService,
  updateResource as updateResourceService,
  deleteResource as deleteResourceService,
  getResourceById as getResourceByIdService
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




export const uploadVideo = async (req: Request, res: Response) => {
  const { title, description, youtubeUrl } = req.body;  // Lấy dữ liệu từ body của request

  try {
    const newResource = new Resource({
      title,
      description,
      fileUrls: [youtubeUrl],  // Lưu URL của video
      type: 'video',
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
    }
  }
};


export const updateVideo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, youtubeUrl, allowedRoles } = req.body;

  try {
    // Tìm video theo ID và đảm bảo nó là loại video
    const resource = await Resource.findById(id);
    if (!resource || resource.type !== 'video') {
      return res.status(404).json({ message: 'Video không tồn tại' });
    }

    // Cập nhật thông tin của video
    resource.title = title;
    resource.description = description;
    resource.fileUrls = [youtubeUrl];
    resource.allowedRoles = allowedRoles; // Cập nhật allowedRoles

    await resource.save();
    res.status(200).json(resource); // Trả về video đã cập nhật
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
    }
  }
};



export const deleteVideo = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Tìm và xóa video dựa trên ID, đảm bảo nó là loại video
    const resource = await Resource.findOneAndDelete({ _id: id, type: 'video' });
    if (!resource) {
      return res.status(404).json({ message: 'Video không tồn tại' });
    }

    res.status(200).json({ message: 'Video đã được xóa' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
    }
  }
};


// Lấy tất cả video
export const getAllVideos = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;  // Hỗ trợ phân trang nếu cần

  try {
    // Tìm tất cả tài liệu với type là 'video'
    const videos = await Resource.find({ type: 'video' })
      .skip((Number(page) - 1) * Number(limit))  // Phân trang
      .limit(Number(limit));  // Giới hạn số lượng video trả về mỗi lần

    // Trả về danh sách video
    res.status(200).json(videos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
    }
  }
};

// Lấy video theo ID
export const getVideoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Tìm video theo ID và kiểm tra xem nó có phải là loại 'video' không
    const video = await Resource.findOne({ _id: id, type: 'video' });
    if (!video) {
      return res.status(404).json({ message: 'Video không tồn tại' });
    }

    // Trả về chi tiết video
    res.status(200).json(video);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Đã xảy ra lỗi không xác định' });
    }
  }
};


//  Lấy tài liệu theo ID
export const getResourceById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const resource = await Resource.findById(id); // Tìm tài liệu theo ID

    if (!resource) return res.status(404).json({ message: 'Tài liệu không tồn tại' });

    res.status(200).json(resource); // Trả về tài liệu
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); // Xử lý lỗi
  }
};