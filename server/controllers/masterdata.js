import Masterdata from '../models/masterdata';

export default {
  getAllDepartment: async (req, res) => {
  
    try {
      const keyword = req.query?.keyword || '';
      const limit = Number(req.query?.limit || 0);
      const offset = Number(req.query?.offset || 0);

      console.log("[CONTROLLER]Masterdata ~ getAllDepartment ~ req.query", req.body);
      
      const data = await Masterdata.getAllDepartment({keyword, limit, offset});
      console.log("[CONTROLLER]Masterdata ~ getAllDepartment ~ data", data);
      
      const rowTotal = await Masterdata.getTotalRows('department').catch(err => { res.status(500).json([err.sqlMessage]); });
      console.log("[CONTROLLER]Masterdata ~ getAllDepartment ~ rowTotal", rowTotal);
  
      res.status(200).json({ data: data, total: rowTotal, offset: offset || null, limit: limit || null  });
  
    } catch(err) {
      res.status(500).json([err]);
    }
  },
  getAllPosition: async (req, res) => {
  
    try {
      const keyword = req.query?.keyword || '';
      const limit = Number(req.query?.limit || 0);
      const offset = Number(req.query?.offset || 0);
      console.log("[CONTROLLER]Masterdata ~ getAllPosition ~ req.query", req.body);
      
      const data = await Masterdata.getAllPosition({keyword, limit, offset, department_id: req.query?.department_id});
      console.log("[CONTROLLER]Masterdata ~ getAllPosition ~ data", data);
      
      const rowTotal = await Masterdata.getTotalRows('position').catch(err => { res.status(500).json([err.sqlMessage]); });
      console.log("[CONTROLLER]Masterdata ~ getAllPosition ~ rowTotal", rowTotal);
    
      res.status(200).json({ data: data, total: rowTotal, offset: offset || null, limit: limit || null  });
  
    } catch(err) {
      res.status(500).json([err]);
    }
  }
}