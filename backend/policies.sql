-- Run this AFTER schema.sql succeeds

-- Projects policies
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Papers policies
CREATE POLICY "Users can view papers in their projects" ON papers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = papers.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert papers in their projects" ON papers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = papers.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update papers in their projects" ON papers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = papers.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete papers in their projects" ON papers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = papers.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Clusters policies
CREATE POLICY "Users can view clusters in their projects" ON clusters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = clusters.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert clusters in their projects" ON clusters
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = clusters.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update clusters in their projects" ON clusters
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = clusters.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete clusters in their projects" ON clusters
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = clusters.project_id 
            AND projects.user_id = auth.uid()
        )
    );

