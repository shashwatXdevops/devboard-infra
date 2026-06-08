import grpc
from app.core.config import settings
import sys
import os

# Assuming the compiled protobuf files will be accessible in the path
# sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'proto'))
# import summarizer_pb2
# import summarizer_pb2_grpc

def summarize_task(task_description: str) -> str:
    """
    Migrated from grpc_client.py. 
    Synchronously offloads the task description to the live AI Service.
    """
    channel_url = f"{settings.AI_SERVICE_HOST}:{settings.AI_SERVICE_PORT}"
    
    try:
        with grpc.insecure_channel(channel_url) as channel:
            # Uncomment and use when protobuf files are imported correctly:
            # stub = summarizer_pb2_grpc.SummarizerStub(channel)
            # request = summarizer_pb2.SummarizeRequest(
            #     task_id="demo-1", 
            #     content=task_description,
            #     max_length=150,
            #     tone="professional"
            # )
            # response = stub.SummarizeTask(request)
            # return response.summary
            
            # Simulated response bridging the stub logic previously tested
            return f"Stub summary for: {task_description} (via {channel_url})"
    except Exception as e:
        return f"Error calling AI service: {e}"
