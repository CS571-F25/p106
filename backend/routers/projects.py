from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database import get_supabase
from routers.auth import get_current_user

router = APIRouter()

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str]
    created_at: str

@router.get("")
async def list_projects(authorization: str = Header(None)):
    user = get_current_user(authorization)
    supabase = get_supabase()
    
    try:
        response = supabase.table("projects").select("*").eq("user_id", user.id).order("created_at", desc=True).execute()
        return {"projects": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
async def create_project(project: ProjectCreate, authorization: str = Header(None)):
    user = get_current_user(authorization)
    supabase = get_supabase()
    
    try:
        data = {
            "user_id": user.id,
            "name": project.name,
            "description": project.description
        }
        response = supabase.table("projects").insert(data).execute()
        return {"project": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{project_id}")
async def get_project(project_id: str, authorization: str = Header(None)):
    user = get_current_user(authorization)
    supabase = get_supabase()
    
    try:
        response = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user.id).execute()
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"project": response.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{project_id}")
async def update_project(project_id: str, project: ProjectUpdate, authorization: str = Header(None)):
    user = get_current_user(authorization)
    supabase = get_supabase()
    
    try:
        update_data = {}
        if project.name is not None:
            update_data["name"] = project.name
        if project.description is not None:
            update_data["description"] = project.description
        
        response = supabase.table("projects").update(update_data).eq("id", project_id).eq("user_id", user.id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"project": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{project_id}")
async def delete_project(project_id: str, authorization: str = Header(None)):
    user = get_current_user(authorization)
    supabase = get_supabase()
    
    try:
        # Delete associated papers first
        supabase.table("papers").delete().eq("project_id", project_id).execute()
        # Delete the project
        response = supabase.table("projects").delete().eq("id", project_id).eq("user_id", user.id).execute()
        return {"message": "Project deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

