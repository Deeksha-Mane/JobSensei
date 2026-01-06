import os
import tempfile
import subprocess
from jinja2 import Environment, FileSystemLoader
import pdfkit

class ResumeGenerator:
    def __init__(self):
        self.template_dir = os.path.join(os.path.dirname(__file__), '..', 'templates')
        self.env = Environment(
            loader=FileSystemLoader(self.template_dir),
            block_start_string='\BLOCK{',
            block_end_string='}',
            variable_start_string='\VAR{',
            variable_end_string='}',
            comment_start_string='\#{',
            comment_end_string='}',
            line_statement_prefix='%%',
            line_comment_prefix='%#',
            trim_blocks=True,
            autoescape=False,
        )

    def generate_resume(self, resume_data):
        """
        Generate a resume PDF from the provided data.
        
        Args:
            resume_data (dict): Dictionary containing resume information
            
        Returns:
            bytes: The generated PDF file as bytes
        """
        # Load the template
        template = self.env.get_template('resume_template.tex')
        
        # Render the template with the data
        latex_content = template.render(**resume_data)
        
        # Create a temporary directory for the LaTeX files
        with tempfile.TemporaryDirectory() as temp_dir:
            # Write the LaTeX content to a file
            tex_file = os.path.join(temp_dir, 'resume.tex')
            with open(tex_file, 'w', encoding='utf-8') as f:
                f.write(latex_content)
            
            # Compile the LaTeX file to PDF
            try:
                subprocess.run(
                    ['latexmk', '-pdf', '-interaction=nonstopmode', tex_file],
                    cwd=temp_dir,
                    check=True
                )
                
                # Read the generated PDF
                pdf_file = os.path.join(temp_dir, 'resume.pdf')
                with open(pdf_file, 'rb') as f:
                    pdf_bytes = f.read()
                
                return pdf_bytes
            
            except subprocess.CalledProcessError as e:
                print(f"Error compiling LaTeX: {e}")
                raise

def generate_resume_pdf(resume_data):
    """
    Generate a resume PDF from the provided data.
    
    Args:
        resume_data (dict): Dictionary containing resume information
            {
                'name': str,
                'location': str,
                'email': str,
                'phone': str,
                'website': str,
                'linkedin': str,
                'github': str,
                'educations': [
                    {
                        'duration': str,
                        'institution': str,
                        'degree': str,
                        'gpa': str,
                        'coursework': str
                    }
                ],
                'experiences': [
                    {
                        'duration': str,
                        'title': str,
                        'company': str,
                        'location': str,
                        'highlights': [str]
                    }
                ],
                'projects': [
                    {
                        'duration': str,
                        'name': str,
                        'highlights': [str],
                        'tools': str
                    }
                ],
                'technical_skills': str,
                'soft_skills': str
            }
            
    Returns:
        bytes: The generated PDF file as bytes
    """
    generator = ResumeGenerator()
    return generator.generate_resume(resume_data) 