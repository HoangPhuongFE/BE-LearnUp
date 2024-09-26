import Resource from '../models/Resource';
import Subject from '../models/Subject';
import { ObjectId } from 'mongodb';

export const createResource = async (
  subjectId: string,
  title: string,
  description: string,
  fileUrls: string[],
  type: string,
  allowedRoles: string[]
) => {
  // Tạo tài liệu mới cho Resource
  const resource = new Resource({ title, description, fileUrls, type, allowedRoles });
  await resource.save();

  // Tìm Subject theo subjectId và thêm resource._id vào mảng resources
  const subject = await Subject.findById(subjectId);
  if (subject) {
    // Ép kiểu _id thành ObjectId
    const resourceId = resource._id as ObjectId;

    subject.resources.push(resourceId); // Chỉ thêm ObjectId của resource
    await subject.save();
  }

  return resource;
};

export const getResources = async (subjectId: string, page = 1, limit = 10) => {
  const subject = await Subject.findById(subjectId).populate('resources');
  if (!subject) throw new Error('Subject not found');

  const resources = subject.resources;
  const startIndex = (page - 1) * limit;
  const paginatedResources = resources.slice(startIndex, startIndex + limit);

  return {
    resources: paginatedResources,
    totalPages: Math.ceil(resources.length / limit),
    totalResources: resources.length,
    currentPage: page,
  };
};

export const updateResource = async (
  id: string,
  data: { title?: string; description?: string; fileUrls?: string[]; type?: string; allowedRoles?: string[] }
) => {
  return await Resource.findByIdAndUpdate(id, data, { new: true });
};

export const deleteResource = async (id: string) => {
  return await Resource.findByIdAndDelete(id);
};
