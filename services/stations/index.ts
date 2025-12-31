
import { api } from '../../core/request'
import { Station } from './types' // 改为直接引用同级文件

export const stationsApi = {
  /**
   * 获取电站列表
   */
  getStations: async (params?: { 
    search?: string; 
    type?: string; 
    lat?: number; 
    lng?: number 
  }): Promise<Station[]> => {
    return api.get<Station[]>('/stations', {
      params: params as any,
      requireAuth: false
    })
  },

  getStationById: async (id: string): Promise<Station | undefined> => {
    return api.get<Station>(`/stations/${id}`, {
      requireAuth: false
    })
  }
}
