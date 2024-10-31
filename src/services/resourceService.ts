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
  const resource = new Resource({ title, description, fileUrls, type, allowedRoles, subject: subjectId });  // Lưu subjectId
  await resource.save();

  const subject = await Subject.findById(subjectId);
  if (subject) {
    const resourceId = resource._id as ObjectId;
    subject.resources.push(resourceId);
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

export const getResourceById = async (id: string) => {
  return await Resource.findById(id).populate('subject', 'name');  
};
export const getAllResources = async (page: number, limit: number) => {
  const resources = await Resource.find()
    .skip((page - 1) * limit)  // Phân trang
    .limit(limit);              // Giới hạn số lượng tài liệu mỗi lần

  const totalResources = await Resource.countDocuments();
  return {
    resources,
    totalPages: Math.ceil(totalResources / limit),
    totalResources,
    currentPage: page,
  };
};