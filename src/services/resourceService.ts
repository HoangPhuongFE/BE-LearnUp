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

export const getResources = async (subjectId: string) => {
  // Tìm kiếm tài liệu dựa trên subjectId mà không phân trang
  const subject = await Subject.findById(subjectId).populate('resources');
  if (!subject) throw new Error('Subject not found');

  return {
    resources: subject.resources,
    totalResources: subject.resources.length,
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
export const getAllResources = async () => {
  // Trả về toàn bộ tài liệu mà không phân trang
  const resources = await Resource.find();
  const totalResources = await Resource.countDocuments();

  return {
    resources,
    totalResources,
  };
};