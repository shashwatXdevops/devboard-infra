import os
import grpc

AI_SERVICE_HOST = os.environ.get("AI_SERVICE_HOST", "localhost")
AI_SERVICE_PORT = os.environ.get("AI_SERVICE_PORT", "50051")

def summarize_task(task_description: str) -> str:
    # This is a stub implementation. In a real app, you would import 
    # the generated pb2 and pb2_grpc files like:
    # import task_pb2
    # import task_pb2_grpc
    
    channel_url = f"{AI_SERVICE_HOST}:{AI_SERVICE_PORT}"
    
    try:
        with grpc.insecure_channel(channel_url) as channel:
            # Uncomment and use when protobuf files are generated:
            # stub = task_pb2_grpc.TaskServiceStub(channel)
            # request = task_pb2.TaskRequest(description=task_description)
            # response = stub.SummarizeTask(request)
            # return response.summary
            
            # Simulated response for the stub
            return f"Stub summary for: {task_description} (via {channel_url})"
    except Exception as e:
        return f"Error calling AI service: {e}"
