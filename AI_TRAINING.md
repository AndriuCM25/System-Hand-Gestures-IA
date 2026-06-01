# 🤖 Fase 2 - Entrenamiento de IA

## Objetivo

Entrenar un modelo de clasificación de gestos de mano usando Google Teachable Machine y MediaPipe Hands.

## Herramientas

### 1. Google Teachable Machine
- **URL**: https://teachablemachine.withgoogle.com/
- **Ventajas**: 
  - Interfaz visual intuitiva
  - No requiere programación
  - Exportación directa a TensorFlow.js
  - Entrenamiento en el navegador

### 2. MediaPipe Hands
- **Librería**: @mediapipe/hands
- **Función**: Detección de landmarks de la mano en tiempo real
- **Precisión**: 98%+ en condiciones óptimas

## Clases del Modelo

### Mínimo 5 Clases Requeridas

1. **open_hand** (Mano Abierta)
   - Todos los dedos extendidos
   - Palma visible hacia la cámara
   - Acción: Activar sistema

2. **fist** (Puño Cerrado)
   - Todos los dedos cerrados
   - Mano en forma de puño
   - Acción: Pausar

3. **thumbs_up** (Pulgar Arriba)
   - Solo pulgar extendido
   - Otros dedos cerrados
   - Acción: Confirmar

4. **peace** (Dos Dedos)
   - Índice y medio extendidos
   - Otros dedos cerrados
   - Acción: Abrir menú

5. **pointing_right** (Apuntar Derecha)
   - Solo índice extendido
   - Mano apuntando a la derecha
   - Acción: Siguiente

### Clases Adicionales (Opcional)

6. **pointing_left** (Apuntar Izquierda)
7. **ok_sign** (Señal OK)
8. **rock_sign** (Señal Rock)
9. **palm_up** (Palma Arriba)
10. **swipe_motion** (Movimiento de Barrido)

## Proceso de Captura de Dataset

### Requisitos de Captura

- **Cantidad**: 150-300 imágenes por gesto
- **Variaciones necesarias**:
  - ✅ Diferentes iluminaciones (natural, artificial, tenue, brillante)
  - ✅ Diferentes fondos (claro, oscuro, con objetos, uniforme)
  - ✅ Diferentes ángulos (frontal, lateral, inclinado)
  - ✅ Diferentes distancias (cerca, media, lejos)
  - ✅ Diferentes tonos de piel
  - ✅ Con/sin accesorios (anillos, pulseras)

### Consejos para Mejor Precisión

1. **Iluminación**
   - Captura con luz natural y artificial
   - Evita sombras fuertes
   - Prueba con diferentes intensidades

2. **Fondos**
   - Usa fondos variados
   - Incluye fondos complejos
   - Evita fondos que se parezcan al tono de piel

3. **Posiciones**
   - Captura desde diferentes ángulos
   - Varía la distancia a la cámara
   - Incluye ligeras rotaciones

4. **Consistencia**
   - Mantén el gesto claro y definido
   - Evita gestos ambiguos
   - Asegura que cada clase sea distintiva

## Guía Paso a Paso - Teachable Machine

### Paso 1: Configuración Inicial

1. Ir a https://teachablemachine.withgoogle.com/
2. Seleccionar "Image Project"
3. Elegir "Standard image model"

### Paso 2: Crear Clases

```
Class 1: open_hand
Class 2: fist
Class 3: thumbs_up
Class 4: peace
Class 5: pointing_right
```

### Paso 3: Capturar Imágenes

Para cada clase:
1. Click en "Webcam"
2. Posicionar la mano en el gesto
3. Click en "Hold to Record"
4. Mantener presionado mientras mueves ligeramente la mano
5. Repetir con diferentes condiciones

**Objetivo**: 200+ imágenes por clase

### Paso 4: Entrenamiento

1. Click en "Train Model"
2. Configuración recomendada:
   - Epochs: 50
   - Batch size: 16
   - Learning rate: 0.001
3. Esperar a que termine el entrenamiento (5-10 minutos)

### Paso 5: Pruebas

1. Usar la vista previa para probar el modelo
2. Verificar que reconoce correctamente cada gesto
3. Si la precisión es baja (<90%), agregar más imágenes

### Paso 6: Exportación

1. Click en "Export Model"
2. Seleccionar "TensorFlow.js"
3. Elegir "Upload my model"
4. Copiar el link generado

**Archivos generados**:
- `model.json` - Arquitectura del modelo
- `weights.bin` - Pesos entrenados
- `metadata.json` - Información de las clases

## Integración con el Proyecto

### Opción 1: Usar el Link de Teachable Machine

```javascript
import * as tmImage from '@teachablemachine/image-models';

const modelURL = 'https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/';

async function loadModel() {
  const model = await tmImage.load(
    modelURL + 'model.json',
    modelURL + 'metadata.json'
  );
  return model;
}
```

### Opción 2: Descargar y Hospedar Localmente

1. Descargar los archivos del modelo
2. Colocar en `public/models/`
3. Cargar desde ruta local:

```javascript
const model = await tmImage.load(
  '/models/model.json',
  '/models/metadata.json'
);
```

## Uso con MediaPipe

El proyecto actual usa **MediaPipe Hands** para detección en tiempo real, que es más eficiente que Teachable Machine para gestos de mano.

### Ventajas de MediaPipe

- ✅ Detección de 21 landmarks por mano
- ✅ Tracking en tiempo real (60+ FPS)
- ✅ Funciona sin entrenamiento previo
- ✅ Menor latencia
- ✅ Más robusto a diferentes condiciones

### Arquitectura Híbrida (Recomendado)

```
MediaPipe Hands → Detectar landmarks → Clasificador Custom → Acción
```

1. **MediaPipe**: Detecta la mano y extrae landmarks
2. **Clasificador**: Analiza landmarks para identificar gesto
3. **Acción**: Ejecuta la acción correspondiente

## Métricas de Evaluación

### Matriz de Confusión

```python
from sklearn.metrics import confusion_matrix, classification_report

# Después de hacer predicciones
cm = confusion_matrix(y_true, y_pred)
print(classification_report(y_true, y_pred))
```

### Métricas Objetivo

- **Accuracy**: >95%
- **Precision**: >93%
- **Recall**: >93%
- **F1-Score**: >93%

## Mejoras Avanzadas

### 1. Data Augmentation

```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2
)
```

### 2. Transfer Learning

Usar modelos pre-entrenados:
- MobileNetV2
- EfficientNet
- ResNet50

### 3. Ensemble Methods

Combinar múltiples modelos para mejor precisión.

## Troubleshooting

### Problema: Baja Precisión

**Soluciones**:
- Agregar más imágenes de entrenamiento
- Mejorar la variedad del dataset
- Aumentar epochs de entrenamiento
- Usar data augmentation

### Problema: Confusión entre Gestos

**Soluciones**:
- Hacer gestos más distintivos
- Agregar más ejemplos de casos límite
- Revisar que las clases sean claramente diferentes

### Problema: Lento en Producción

**Soluciones**:
- Usar modelo más ligero (MobileNet)
- Reducir resolución de entrada
- Implementar throttling
- Usar Web Workers

## Recursos

- [Teachable Machine](https://teachablemachine.withgoogle.com/)
- [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Hand Gesture Recognition Tutorial](https://www.tensorflow.org/lite/examples/gesture_classification/overview)

---

**Nota**: El proyecto actual usa detección basada en landmarks de MediaPipe, que es más eficiente que clasificación de imágenes para gestos de mano en tiempo real.
